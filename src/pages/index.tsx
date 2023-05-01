export default function Home() {
	return (
		<main className="flex flex-col items-center justify-around min-h-full p-24">
			<div className="relative flex place-items-center">
				<h1 className="text-6xl font-bold text-black">Welcome Client</h1>
			</div>

			<div className="flex items-center justify-around w-full mb-32 text-center lg:mb-0 lg:text-left">
				<a
					href="/create"
					className="px-5 py-4 transition-colors border border-transparent rounded-lg group hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						Create New{' '}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
						Creates New RPS with another member.
					</p>
				</a>
			</div>
		</main>
	)
}
