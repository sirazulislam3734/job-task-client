import { useEffect, useState } from "react";

const DeadlineLoading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return oldProgress + 1;
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-screen ">
            <div className="text-center ">
                <h1 className="text-2xl font-bold mb-4">Deadline Loading</h1>
                <div className="relative w-96 h-6 bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute left-0 h-full bg-red-600" style={{ width: `${progress}%`, transition: "width 0.1s linear" }}></div>
                    <div className="absolute left-0 h-full flex items-center justify-between w-full px-2">
                        <span className="text-red-500">🧛‍♂️</span>
                        <span className="">💻</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeadlineLoading;