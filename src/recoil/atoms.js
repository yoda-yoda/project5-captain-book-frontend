import { atom } from 'recoil';

export const selectedCalendar = atom({
    key: 'selectedCalendar',
    default: {
        id: 0,
        date: "1111-11-11",
        title: "title",
        totalAmount: 0
    }
})


export const selectedCalendarItem = atom({
    key: 'selectedCalendarItem',
    default: {
        calendarResponseDto: {
            id: 0,
            date: "1111-11-11",
            title: "title",
            totalAmount: 0
        },
        calendarItemResponseDtoList: [{
            id: 0,
            itemTitle: "title",
            itemAmount: 0,
            itemType: "지출",
            createdAt: "2000-01-01T00:00:00.000000",
            updatedAt: "2000-01-01T00:00:00.000000",
        }],
        totalAmountDto: {
            totalPlus: 0,
            totalMinus: 0,
            totalAmount: 0
        }
    }
})