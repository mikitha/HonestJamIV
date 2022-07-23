enum Controls {
  WORKSPACE_1,
  WORKSPACE_2,
  WORKSPACE_3,
  WORKSPACE_4,
  WORKSPACE_5,
}

const keyboardMap: { [key: string]: Controls} = {
  1: Controls.WORKSPACE_1,
  2: Controls.WORKSPACE_2,
  3: Controls.WORKSPACE_3,
  4: Controls.WORKSPACE_4,
  5: Controls.WORKSPACE_5,
};

const controlMap = Object.keys(keyboardMap).reduce((acc: {[key in Controls]: Array<string>}, key: string) => {
  if (keyboardMap[key] in acc) {
    acc[keyboardMap[key]].push(key);
  } else {
    acc[keyboardMap[key]] = [key];
  }
  return acc;
}, {} as {[key in Controls]: Array<string>});

const currentlyPressedKeys: {[key: string]: boolean} = {};

window.addEventListener('keydown', ev => {
  if (ev.key in keyboardMap) {
    currentlyPressedKeys[ev.key] = true;
  }
});
window.addEventListener('keyup', ev => {
  if (ev.key in keyboardMap) {
    currentlyPressedKeys[ev.key] = false;
  }
});

function isControlPressed(control: Controls): boolean {
  return !!controlMap[control].find(keyName => currentlyPressedKeys[keyName]);
}

export { Controls, isControlPressed };
