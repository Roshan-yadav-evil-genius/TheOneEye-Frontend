import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type TWorkFlowState = {
    id: string
}

const initialState: TWorkFlowState = {
    id: ""
}


const WorkFlowSlice = createSlice({
    name: "WorkFlowSlice",
    initialState: initialState,
    reducers: {
        setWorkFlowId: (state, action:PayloadAction<TWorkFlowState>) => {
            console.log(action.payload.id)
            state.id = action.payload.id
        }
    }
})


const WorkFlowReducer = WorkFlowSlice.reducer;
export const { setWorkFlowId } = WorkFlowSlice.actions;
export default WorkFlowReducer;