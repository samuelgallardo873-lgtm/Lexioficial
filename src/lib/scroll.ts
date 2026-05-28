export function scrollToTop() {
  const options: ScrollToOptions = { top: 0, left: 0, behavior: "instant" };
  try {
    window.scrollTo(options);
  } catch (e) {}
  try {
    document.documentElement.scrollTo(options);
  } catch (e) {}
  try {
    document.body.scrollTo(options);
  } catch (e) {}
  const root = document.getElementById("root");
  if (root) {
    try {
      root.scrollTo(options);
    } catch (e) {}
  }
}
