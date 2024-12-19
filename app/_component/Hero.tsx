import React from 'react';

function Hero() {
    return (
        <div>
            <section
                className="bg-gray-50 relative bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('/Background.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                    <div className="mx-auto max-w-xl text-center">
                        <h1 className="text-3xl font-extrabold text-white sm:text-5xl">
                            Spend Smart,
                            <strong className="font-extrabold text-green-400 sm:block">
                                Live Better.
                            </strong>
                        </h1>
                        <p className="mt-4 text-white sm:text-xl/relaxed">
                            Manage your money like a pro with real-time tracking, detailed insights, and intuitive features.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Hero;
