export const API_BACKEND = 'localhost:8000/api/v1/';



export interface RegisterRequest {
    username:string;
    email:string;
    password:string
}



export async function registerUser(data: RegisterRequest) {
    const response = await fetch(`${API_BACKEND}/auth/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!response.ok){
        throw new Error("Failed to register user");
    }
}


