import { supabase } from "@/lib/supabase";

export const signUp = async (
  email: string,
  password: string,
  phone: string,
  name: string,
) => {
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { phone, name },
    },
  });

  if (authError) {
    throw authError;
  }

  const userId = data?.user?.id;

  if (!userId) {
    throw new Error("User ID not returned");
  }

  const { error: insertError } = await supabase.from("users").insert({
    id: userId,
    email,
    phone,
    name,
  });

  if (insertError) {
    throw insertError;
  }

  return data;
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const user = data.user;

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return { user, profile };
};

export const getToiletsData = async () => {
  const { data, error } = await supabase.from("toilets").select("*");

  if (error) {
    console.error("Error fetching toilets data:", error);
    throw error;
  }

  return data;
};
