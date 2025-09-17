import { atom } from 'recoil';

export const loginAtom = atom({
    key: 'loginAtom',
    default: {
        isLogin: false,
        user: {
            id: null,
            email: null,
            name: null,
            picture: null
        }
    }
})

