import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">MADE IN INDIA VERIFICATION</h2>
        <p className="text-lg max-w-2xl">
          SatyaChain uses blockchain technology to verify the origin of products 
          through a transparent Bill of Materials (BoM) analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="brutalist-border p-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">SUPPLIERS</h3>
          <p className="mb-4">Submit your product BoM for instant verification of local content percentage.</p>
          <Link href="/supplier" className="brutalist-button inline-block">
            Submit Product
          </Link>
        </div>

        <div className="brutalist-border p-6">
          <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">BUYERS</h3>
          <p className="mb-4">Browse verified products and view their origin verification + risk assessment.</p>
          <Link href="/dashboard" className="brutalist-button-inverse inline-block">
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="brutalist-border p-6 w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">HOW IT WORKS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">1</div>
            <p className="font-bold">SUBMIT BoM</p>
            <p className="text-sm">Supplier enters product components with origin</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">2</div>
            <p className="font-bold">ANALYZE</p>
            <p className="text-sm">System calculates local % and runs risk engine</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">3</div>
            <p className="font-bold">VERIFY ON-CHAIN</p>
            <p className="text-sm">Result stored permanently on blockchain</p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm">
        <p className="font-bold">CLASSIFICATION SYSTEM</p>
        <div className="flex gap-4 mt-2 justify-center">
          <span className="badge badge-class-i">Class I: 50%+ Local</span>
          <span className="badge badge-class-ii">Class II: 20-50% Local</span>
          <span className="badge badge-non-local">Non-local: &lt;20%</span>
        </div>
      </div>
    </div>
  );
}