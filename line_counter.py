import os

def count_lines_in_project(directory, extensions=None, exclude_dirs=None):
    if extensions is None:
        extensions = {".py", ".js", ".jsx", ".ts", ".tsx", ".html", ".css"}
    if exclude_dirs is None:
        exclude_dirs = {"node_modules", "modules"}

    total_lines = 0
    lines_per_extension = {ext: 0 for ext in extensions}

    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            for ext in extensions:
                if file.endswith(ext):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            line_count = sum(1 for _ in f)
                            total_lines += line_count
                            lines_per_extension[ext] += line_count
                    except (UnicodeDecodeError, PermissionError, Exception) as e:
                        print(f"Skipping {file_path}: {e}")

    return total_lines, lines_per_extension

if __name__ == "__main__":
    project_dir = os.getcwd()

    try:
        total, lines_per_ext = count_lines_in_project(project_dir)

        output_text = f"Total lines of code: {total}\n"
        for ext, count in lines_per_ext.items():
            output_text += f"{ext} code = {count}\n"

        output_file = "code_line_count.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(output_text)

        print(f"Line count saved to {output_file}")

    except Exception as e:
        print(f"An error occurred: {e}")
