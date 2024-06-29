import type { H3Event, EventHandlerRequest } from 'h3';

export const getLoggedInUser = async (
  event: H3Event<EventHandlerRequest>
): Promise<number | null> => {
  try {
    const sessionToken = getHeader(event, 'Authorization');
    if (sessionToken == undefined) return null;
    const sessionResult = await sql`SELECT user_id FROM sessions WHERE id = ${sessionToken}`;
    if (sessionResult.length === 0) return null;
    const userId = sessionResult[0].user_id;
    return userId;
  } catch (e) {
    return null;
  }
};

export const getSessionToken = async (
  event: H3Event<EventHandlerRequest>
): Promise<string | null> => {
  try {
    const sessionToken = getHeader(event, 'Authorization');
    return sessionToken ?? null;
  } catch (e) {
    return null;
  }
};
