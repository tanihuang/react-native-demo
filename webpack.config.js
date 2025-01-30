import createExpoWebpackConfigAsync from '@expo/webpack-config';

export default async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    mode: 'production',
  }, argv);

  return config;
};
