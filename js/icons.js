(() => {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
    class: '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v6q6 5 12 0v-6M22 9v8"/>',
    map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16"/>',
    book: '<path d="M12 5Q6 1 2 4v15q5-3 10 1 5-4 10-1V4q-5-3-10 1Zm0 0v15"/>',
    gallery: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 18 6-6 4 4 3-5 5 7"/>',
    game: '<path d="M7 7h10q3 0 4 5l1 6q0 4-5-1H7q-5 5-5 1l1-6q1-5 4-5Z"/><path d="M6 10v6M3 13h6M16 11h.1M19 14h.1"/>',
    medal: '<circle cx="12" cy="15" r="6"/><path d="m5 2 4 8M19 2l-4 8M8 2h8l-4 7"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3l-1 2M12 17h.01"/>',
    clipboard: '<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M8 11h8M8 15h8M8 19h5"/>',
    chat: '<path d="M21 15a3 3 0 0 1-3 3H8l-5 4V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3ZM7 7h10M7 12h7"/>',
    chart: '<path d="M3 3v18h19M7 17v-5M12 17V8M17 17V4"/>',
    teacher: '<path d="M12 3h10v13H12M15 7h4M15 11h3"/><circle cx="6" cy="6" r="3"/><path d="M2 22V14q0-4 4-4t4 4v8M6 15v7"/>',
    ball: '<circle cx="12" cy="12" r="10"/><path d="M4 6q8-2 10 6M14 3q7 7 1 14M22 13q-7 7-14 3M7 21q-6-7 0-13M4 6l3 2 7 4 1 5"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-4a8 8 0 0 1 16 0v4Z"/>',
    sound: '<path d="M3 9h4l5-5v16l-5-5H3ZM16 8q4 4 0 8M19 4q8 8 0 16"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    cross: '<path d="m6 6 12 12M6 18 18 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="m12 2 9 4v6q0 7-9 10-9-3-9-10V6Z"/><path d="m7 12 3 3 7-7"/>'
  };
  const mapping = {
    '1f3e0':'home','1f393':'class','1f5fa':'map','1f4da':'book','1f3ac':'gallery',
    '1f3ae':'game','2b50':'medal','2753':'quiz','1f4dd':'clipboard','1f4ad':'chat',
    '1f4ca':'chart','1f469':'teacher','1f3eb':'teacher','1f3d0':'ball','1f464':'user',
    '1f50a':'sound','1f507':'sound','1f331':'class','1f680':'target','1f3c6':'medal',
    '1f3af':'target','1f91d':'teacher','1f9e0':'quiz','1f44b':'user','1f389':'medal',
    '2705':'check','274c':'cross','1f9cd':'user','1f932':'ball','1f64c':'ball',
    '270b':'ball','1f6e1':'shield'
  };
  function svg(key) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('fill', 'none');
    node.setAttribute('stroke', 'currentColor');
    node.setAttribute('stroke-width', '1.7');
    node.setAttribute('stroke-linecap', 'round');
    node.setAttribute('stroke-linejoin', 'round');
    node.setAttribute('aria-hidden', 'true');
    node.classList.add('menu-icon');
    node.innerHTML = paths[key];
    return node;
  }
  const expression = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B50](?:\uFE0F|\u200D[\u{1F300}-\u{1FAFF}])*/gu;
  function replace(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!n.parentElement?.closest('script,style,svg,textarea,option,input') && n.textContent.match(expression)) nodes.push(n);
    }
    for (const text of nodes) {
      const fragment = document.createDocumentFragment();
      let position = 0;
      for (const match of text.textContent.matchAll(expression)) {
        fragment.append(text.textContent.slice(position, match.index));
        const key = mapping[match[0].codePointAt(0).toString(16)];
        if (key) fragment.append(svg(key));
        position = match.index + match[0].length;
      }
      fragment.append(text.textContent.slice(position));
      text.replaceWith(fragment);
    }
  }
  const observer = new MutationObserver(() => {
    observer.disconnect();
    replace(document.body);
    observer.observe(document.body, { childList: true, subtree: true });
  });
  replace(document.body);
  observer.observe(document.body, { childList: true, subtree: true });
})();
