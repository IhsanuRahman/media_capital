import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../axios';
import { useDispatch } from 'react-redux';

const initialState = {
    user: {},
    loading: false,
    isAuthenticated: false
}
// export const setAuthed =state=>{
//     state.isAuthenticated=true
// }

// export const refresh=createAsyncThunk('user/refresh',async (_,thunkAPI)=>{

//     api.post('token/refresh',{
//         'refresh':localStorage.getItem('refresh'),
//     }).then(e=>{
//         console.log('REFRESH',e.data.access)
//         const { dispatch } = thunkAPI;
//         localStorage.setItem('access',e.data.access)
//         localStorage.removeItem('access')
//         localStorage.removeItem('refresh')
//         dispatch(checkAuth());
//     }).catch(e=>{
//         console.log('REFRESH',e)

//     })
// })
export const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
    if (!(localStorage.getItem('refresh') && localStorage.getItem('access'))) {
        return thunkAPI.rejectWithValue('no token');
    }
    try {
        console.log();
        const res = await api.post('user', {
            'token': localStorage.getItem('refresh')
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`,

            },

        })
        const data = await res.data
        if (res.status === 200) {
            return data;
        } else {
            // api.post('token/refresh',{
            //     'refresh':localStorage.getItem('refresh'),
            // }).then(e=>{
            //     console.log('REFRESH',e.data.access)
            //     const { dispatch } = thunkAPI;
            //     localStorage.setItem('access',e.data.access)
            //     localStorage.removeItem('access')
            //     localStorage.removeItem('refresh')
            //     dispatch(checkAuth());
            // }).catch(e=>{
            //     console.log('REFRESH',e)

            // })
            console.log(data)
            return thunkAPI.fulfillWithValue(data);
        }
    } catch (err) {
        // api.post('token/refresh',{
        //     'refresh':localStorage.getItem('refresh'),
        //     'access':localStorage.getItem('access'),
        // }).then(e=>{
        //     console.log('REFRESH',e)
        //     const { dispatch } = thunkAPI;
        //     localStorage.setItem('access',e.data.access)
        //     return thunkAPI.fulfillWithValue(dispatch(checkAuth()));
        // }).catch(e=>{
        //     localStorage.removeItem('access')
        //     localStorage.removeItem('refresh')
        //     console.log('REFRESH',e)

        // })
        console.log('from   j',err)
        return thunkAPI.rejectWithValue(err.response.data);
    }
});
export const checkAuth = createAsyncThunk(
    'users/verify',
    async (_, thunkAPI) => {

        try {
            if (localStorage.getItem('access') == null || localStorage.getItem('refresh') == null) {
                console.log('token is null')
                return thunkAPI.rejectWithValue('token is null');

            }
            // const response = await api.post('token/verify', JSON.stringify({
            //     'token': localStorage.getItem('access')
            // }), {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${localStorage.getItem('access')}`,

            //     },

            // })

            // if (response.status == 200) {

            //     return response
            // }
                const { dispatch } = thunkAPI;
                dispatch(getUser());
            
        }
        catch (e) {
            // api.post('token/refresh',{
            //     'refresh_token':localStorage.getItem('refresh'),
            //     'access_token':localStorage.getItem('access'),
            // }).then(e=>{
            //     console.log('REFRESH',e)
            // }).catch(e=>{
            //     console.log('REFRESH',e)

            // })
            return thunkAPI.rejectWithValue(e.response.data);
        }
    },
)
export const logout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
    try {

        const res = await api.post("/logout", {
            'refresh_token': localStorage.getItem('refresh'),
            'access_token': localStorage.getItem('access'),
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                },
            }
        )
        if (res.status === 200) {

            return res.data;
        } else {

            return thunkAPI.rejectWithValue(res.data);
        }
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

})
const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setAuthed: state => {
            state.isAuthenticated = true
        }
    },
    extraReducers:
        builder => {
            builder.addCase(checkAuth.fulfilled, state => {
                const s1 = state.isAuthenticated
                console.log();
                state.isAuthenticated = true;
                state.loading = false;
                console.log('changed =', s1 !== state.isAuthenticated)
                console.log("checkAuth");
            }).addCase(checkAuth.pending, state => {
                state.loading = true;
            })
                .addCase(checkAuth.rejected, (state) => {
                    state.isAuthenticated = false;
                    state.user = {}
                    state.loading = false;
                    console.log('checkauth rejected');

                }).addCase(getUser.pending, state => {
                    state.loading = true;
                })
                .addCase(getUser.fulfilled, (state, action) => {

                    state.user = action.payload;
                    state.loading = false;
                    console.log('from silice',state.user)


                }).addCase(getUser.rejected, state => {
                    state.loading = false;
                    state.isAuthenticated = false;
                    state.user = {}
                    

                }).addCase(logout.pending, state => {
                    state.loading = true;
                })
                .addCase(logout.fulfilled, state => {
                    state.isAuthenticated = false;
                    state.user = {};
                    localStorage.clear()
                    state.loading = false;

                })
                .addCase(logout.rejected, state => {
                    state.loading = false;
                })
        }

})
export const { setAuthed } = userSlice.actions
export default userSlice.reducer