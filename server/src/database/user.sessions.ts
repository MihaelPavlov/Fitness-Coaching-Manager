export const sessions: Record<string, {
    sessionId: string,
    id: Number,
    role: String,
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
  
export function createSession(id: Number, role: String) {
    const sessionId = String(Object.keys(sessions).length + 1);
  
    const session = { sessionId, id, valid: true, role };
  
    sessions[sessionId] = session;
  
    return session;
}