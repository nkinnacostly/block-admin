export interface TraderProfile {
  id: number;
  user_id: number;
  starting_equity: string; // kept as string if it's from a backend formatted like "100000.00"
  broker: string;
  login: string;
  investor_password: string;
  server_name: string;
  is_reset: number; // use `boolean` if backend sends it as true/false
  created_at: string; // or use Date if you parse it later
  updated_at: string; // or use Date if you parse it later
}
