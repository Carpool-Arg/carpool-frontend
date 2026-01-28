type TripActionResult =
  | { ok: true }
  | { ok: false; message: string };