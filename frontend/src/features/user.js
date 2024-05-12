import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../axios';

const initialState = {
    user:{},
    loading:false,
    isAuthenticated:false
}
// export const setAuthed =state=>{
//     state.isAuthenticated=true
// }
export  const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
    if (!(localStorage.getItem('refresh') && localStorage.getItem('access'))){
        return thunkAPI.rejectWithValue('no token');
    }
    try {
        console.log();
        const res = await api.post('/user',{
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
            console.log(data)
            return thunkAPI.rejectWithValue(data);
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
                return thunkAPI.rejectWithValue(response.data);

            }
            const response = await api.post('token/verify', JSON.stringify({
                'token': localStorage.getItem('refresh')
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,

                },

            }).catch(e => {
                console.log(e.message)
                return thunkAPI.rejectWithValue(response.data);
            })
            
            if (response.status == 200){
            const { dispatch } = thunkAPI;
                
            dispatch(getUser());

            return response}
            else{
                return thunkAPI.rejectWithValue(response.data);
            }
        }
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
const userSlice= createSlice({
    name:'user',
    initialState:initialState,
    reducers:{setAuthed:state=>{
        state.isAuthenticated=true
    }},
    extraReducers:
        builder => {
            builder.addCase(checkAuth.fulfilled, state => {
                state.loading = false;
                const s1 = state.isAuthenticated
                console.log();
                
                state.isAuthenticated = true;
                console.log('changed =',s1 !== state.isAuthenticated)
                console.log("checkAuth");
            }).addCase(checkAuth.pending, state => {
                state.loading = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user={}
                console.log('checkauth rejected');
                
            }).addCase(getUser.pending, state => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                
                    state.user = action.payload;
                    console.log(state.user)
                

            }).addCase(getUser.rejected, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user={}

            }).addCase(logout.pending, state => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, state => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = {};
                localStorage.clear()
            })
            .addCase(logout.rejected, state => {
                state.loading = false;
            })
        }
    
})
export const {setAuthed} = userSlice.actions
export default userSlice.reducer