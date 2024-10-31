export const getLocalEnv = (app) => {
  return process.env.NODE_ENV === 'development'
    ? `./apps/${app}/.env`
    : undefined;
};
