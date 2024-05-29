const refreshToken = async () => {
    const response = await fetch('/auth/token-refresh', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        return response.json();
    }
    else {
        throw new Error('Failed to refresh token');
    }
}