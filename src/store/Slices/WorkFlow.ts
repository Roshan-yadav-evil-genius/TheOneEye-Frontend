import { backendService } from "@/app/services/backend";
import { TWorkFlow } from "@/types/backendService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"


const initialState: TWorkFlow = {
    id: "",
    name: "",
    description: "",
    created_at: "",
    task_id: "",
    updated_at: ""
}

export const setWorkFlowInfo = createAsyncThunk(
    "WorkFlowSlice/setWorkFlowInfo",
    backendService.getWorkFlow
)

const WorkFlowSlice = createSlice({
    name: "WorkFlowSlice",
    initialState: initialState,
    reducers: {
        setWorkFlowId: (state, action: PayloadAction<{ id: string }>) => {
            state.id = action.payload.id
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(setWorkFlowInfo.fulfilled,(state,action:PayloadAction<TWorkFlow>)=>{
            return action.payload
        })
    }
})



const WorkFlowReducer = WorkFlowSlice.reducer;
export const { setWorkFlowId } = WorkFlowSlice.actions;
export default WorkFlowReducer;