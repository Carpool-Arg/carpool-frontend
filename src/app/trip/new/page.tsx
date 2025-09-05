import { TripForm } from "@/components/trip/TripFrom";

export default function NewTripPage(){
    return(
        <div className="justify-center flex flex-col items-center">
            <h1>Nuevo viaje</h1>
            <TripForm/>
        </div>
    )
}