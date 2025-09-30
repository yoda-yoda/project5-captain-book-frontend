import { atom } from 'recoil';

export const loginAtom = atom({
    key: 'loginAtom',
    default: {
        isLogin: false,
        user: {
            id: null,
            name: null,
            email: null,
            provider: null,
        }
    }
})

