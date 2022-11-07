module.exports = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../pages/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      // tailwindCSS 3.2.2에서 PostCSS 8+ 을 사용하기 때문에 postcssLoaderOptions 옵션 추가해야함
      // https://storybook.js.org/addons/@storybook/addon-postcss/ 참조
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-addon-next',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
};
