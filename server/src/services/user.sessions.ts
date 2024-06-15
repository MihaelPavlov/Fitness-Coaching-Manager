export const sessions: Record<string, {
    sessionId: string,
    id: number,
    username: string,
    role: number,
    valid: boolean
}> = {};

export function getSession(sessionId: string) {
    const session = sessions[sessionId];

    return session && session.valid ? session : null;
}

export function invalidateSession(sessionId: string) {
    const session = sessions[sessionId];
  
    if (session) {
      sessions[sessionId].valid = false;
    }
  
    return sessions[sessionId];
}
  
export function createSession(id: number, role: number, username: string) {
    const sessionId = String(Object.keys(sessions).length + 1);
  
    const session = { sessionId, id, valid: true, role, username };
  
    sessions[sessionId] = session;
  
    return session;
}