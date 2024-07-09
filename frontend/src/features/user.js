import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../axios';

const initialState = {
    user: {},
    loading: false,
    isAuthenticated: false,
    initial:true
}

export const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
    if (!(localStorage.getItem('refresh') && localStorage.getItem('access'))) {
        return thunkAPI.rejectWithValue('no token');
    }
    try {
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
            
            return thunkAPI.fulfillWithValue(data);
        }
    } catch (err) {
        
        return thunkAPI.rejectWithValue(err.response.data);
    }
});
export const checkAuth = createAsyncThunk(
    'users/verify',
    async (_, thunkAPI) => {
        try {
            if (localStorage.getItem('access') == null || localStorage.getItem('refresh') == null) {
                
                return thunkAPI.rejectWithValue('token is null');

            }
                return await api.post('/token/verify',
                    {
                        token:localStorage.getItem('access')
                    }).then(resp=>{
                const { dispatch } = thunkAPI;
                dispatch(getUser());
                return resp.data
            }).catch((e)=> {
                return thunkAPI.rejectWithValue(e.response.detail);
            })        }
        catch (e) {
           
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
            builder.addCase(checkAuth.pending, state => {
                state.initial=false
                state.loading = true;
            }).addCase(checkAuth.fulfilled, state => {
                state.initial=false
                state.isAuthenticated = true;
                state.loading = false;
            }).addCase(checkAuth.rejected, (state) => {
                state.initial=false
                    state.isAuthenticated = false;
                    state.user = {}
                    state.loading = false;
                    console.log('from get user')

                }).addCase(getUser.pending, state => {
                    state.loading = true;
                })
                .addCase(getUser.fulfilled, (state, action) => {
                    state.isAuthenticated = true;

                    state.user = action.payload;
                    state.loading = false;


                }).addCase(getUser.rejected, state => {
                    state.loading = false;
                    state.isAuthenticated = false;
                    state.user = {}
                    console.log('from get user')
                    

                }).addCase(logout.pending, state => {
                    state.loading = true;
                })
                .addCase(logout.fulfilled, state => {
                    state.isAuthenticated = false;
                    state.user = {};
                    localStorage.clear()
                    state.loading = false;
                    console.log('from get user')

                })
                .addCase(logout.rejected, state => {
                    state.loading = false;
                })
        }

})
export const { setAuthed } = userSlice.actions
export default userSlice.reducer