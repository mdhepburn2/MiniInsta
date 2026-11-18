// App palette, carried over from the web version's insta-styles.css.
// White pages with a blue accent; pale yellow is reserved for primary buttons
// and the photo ring, which is the one bold element.

const blue = '#1b6aa5';
const blueDark = '#6cb4ea'; // the web blue is too dark on black, so lighten it
const sun = '#ffe88f';
const sunPressed = '#ffdd66';
const sky = '#8fd0f5';

export default {
  light: {
    text: '#1f2933',
    secondaryText: '#5b6776',
    background: '#fff',
    surface: '#f2f7fb', // inputs, image placeholders, pressed rows
    separator: '#d7e6f0',
    tint: blue,
    sun,
    sunPressed,
    onSun: '#1f2933',
    sky,
    danger: '#b3261e',
    tabIconDefault: '#8b97a4',
    tabIconSelected: blue,
  },
  dark: {
    text: '#eef2f6',
    secondaryText: '#97a3b0',
    background: '#000',
    surface: '#141b22',
    separator: '#26323d',
    tint: blueDark,
    sun,
    sunPressed,
    onSun: '#1f2933',
    sky,
    danger: '#ff6b60',
    tabIconDefault: '#6d7884',
    tabIconSelected: blueDark,
  },
};
