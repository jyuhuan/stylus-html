const sections = Array.from(document.getElementsByTagName("section"));
for (i = 0; i < sections.length; i++) {
  const s = sections[i];
  s.innerHTML = `
    <div class="heading">
      <span class="heading-number">${i+1}</span> ${s.getAttribute("heading")}
    </div> 
    <div>${s.innerHTML}</div>
  `
}