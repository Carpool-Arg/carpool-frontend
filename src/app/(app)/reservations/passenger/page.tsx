import MyReservations from "@/modules/reservation/update/components/MyReservations";

export default function MyTripsPage() {
    return(
        <main className="max-w-lg mx-auto">
            <div className="md:mt-4 lg:mt-4 flex items-center justify-center w-full">
                <MyReservations/>
            </div>
        </main>
    )

}