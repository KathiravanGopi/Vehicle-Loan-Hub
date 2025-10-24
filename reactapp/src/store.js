import {configureStore} from '@reduxjs/toolkit'
import userReducer from './redux/slices/userSlice'
import loanApplicationReducer from './redux/slices/loanApplicationSlice'
import loanReducer from './redux/slices/loanSlice'

const store = configureStore({
    reducer:{
        user: userReducer,
        loanApplications: loanApplicationReducer,
        loans: loanReducer
    }
})

export default store