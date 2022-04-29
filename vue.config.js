module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
      electronBuilder: {
        builderOptions: {
          appId: 'vie1-data-manager',
          win: {
            icon: './public/circle-icon.ico'
          },
          extraResources: [
              "./files/**"
          ]
        }
      }
  }
}