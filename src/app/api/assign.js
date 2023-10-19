import axiosClient from "./axiosClient"

const AssignApi = {
    getAllAssigns: async () => {
        try{
            const res = await axiosClient.get('/')
        }catch(error){
            
        }
    }
}