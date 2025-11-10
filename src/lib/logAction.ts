export async function logUserAction(actionType: string, metadata?: any) {
  await fetch('/api/analytics/logAction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ actionType, metadata })
  });
}
