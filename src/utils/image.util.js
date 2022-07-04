export const previewImg = (img) => {
  const preImg = document.getElementById("preview-img");
  const url = URL.createObjectURL(img);
  preImg.src = url;
  preImg.onload = () => {
    URL.revokeObjectURL(url);
  };
};
