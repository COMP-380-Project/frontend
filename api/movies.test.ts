import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";

import {apiFetch} from "./api";
import {
    fetchShowtimeSeats,
    addSeatToCart
} from "./movies";

vi.mock("./api", () => ({
    apiFetch: vi.fn(),
}));

const mockedApiFetch = vi.mocked(apiFetch);

const mockResponse = (
    data: unknown,
    ok = true,
    status = 200
): Response => {
    return {
        ok,
        status,
        json: async () => data,
    } as Response;
};

describe("Movies Frontend API Tests", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load available seats for a showtime", async () => {

        mockedApiFetch.mockResolvedValue(
            mockResponse({
                seats: [
                    {
                        id: 1,
                        seat_number: "C1",
                        is_booked: false,
                        is_locked: false,
                        lock_expires_at: null,
                        status: "available",
                    },
                ],
            })
        );

        const seats = await fetchShowtimeSeats(5);

        expect(apiFetch).toHaveBeenCalledWith(
            "/api/seats/showtime/5"
        );

        expect(seats).toEqual([
            {
                id: 1,
                seatNumber: "C1",
                isBooked: false,
                isLocked: false,
                lockExpiresAt: null,
                status: "available",
            },
        ]);
    });

    it("should add an available seat to the cart", async () => {

        mockedApiFetch.mockResolvedValue(
            mockResponse({
                ticket: {
                    id: 20,
                    seat_number: "C1",
                    ticket_type: "adult",
                    price: 12.50,
                },
            })
        );

        const result = await addSeatToCart(
            1,
            5,
            1
        );

        expect(apiFetch).toHaveBeenCalledWith(
            "/api/cart/1/add-seat",
            {
                method: "POST",
                body: JSON.stringify({
                    showtime_id: 5,
                    seat_id: 1,
                    ticket_type: "adult",
                }),
            }
        );

        expect(result).toEqual({
            id: 20,
            showtimeId: 5,
            seatId: 1,
            seatNumber: "C1",
            ticketType: "adult",
            price: 12.50,
        });
    });

    it("should reject a seat that is already locked", async () => {

        mockedApiFetch.mockResolvedValue(
            mockResponse(
                {
                    error: "Seat is already locked",
                },
                false,
                400
            )
        );

        await expect(
            addSeatToCart(1, 5, 1)
        ).rejects.toThrow(
            "Seat no longer available. Please choose another seat."
        );
    });

    it("should reject a seat that is already booked", async () => {

        mockedApiFetch.mockResolvedValue(
            mockResponse(
                {
                    error: "Seat is already booked",
                },
                false,
                400
            )
        );

        await expect(
            addSeatToCart(1, 5, 1)
        ).rejects.toThrow(
            "Seat no longer available. Please choose another seat."
        );
    });

});