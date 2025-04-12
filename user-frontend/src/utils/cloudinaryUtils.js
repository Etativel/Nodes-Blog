function formatCloudinaryUrl(originalUrl, options = {}) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    dpr = "auto",
  } = options;

  const transformation = [
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    crop ? `c_${crop}` : "",
    quality ? `q_${quality}` : "",
    format ? `f_${format}` : "",
    dpr ? `dpr_${dpr}` : "",
  ]
    .filter(Boolean)
    .join(",");

  return originalUrl.replace("/upload/", `/upload/${transformation}/`);
}

export default formatCloudinaryUrl;
