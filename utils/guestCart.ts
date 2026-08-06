const GUEST_CART_ID_KEY = "guestCartId";

export function getGuestCartId(): number {
    const savedId = localStorage.getItem(GUEST_CART_ID_KEY);

    if (savedId) {
        return Number(savedId);
    }

    const guestId = -Date.now();
    localStorage.setItem(GUEST_CART_ID_KEY, String(guestId));

    return guestId;
}