// export const config = () => ({
//   port: process.env.PORT || 3000,
//   supabase: {
//     url: process.env.SUPABASE_URL,
//     key: process.env.SUPABASE_KEY,
//     jwtSecret: process.env.SUPABASE_JWT_SECRET,
//   },
//   openai: {
//     apiKey: process.env.OPENAI_API_KEY,
//   },
// });

export const config = () => ({
  port: process.env.PORT || 3000,
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});
