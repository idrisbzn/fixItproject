import Navbar from '../../components/common/Navbar';
import HeroSection from '../../components/visitor/HeroSection';
import StatsSection from '../../components/visitor/StatsSection';
import HowItWorks from '../../components/visitor/HowItWorks';
import Footer from '../../components/visitor/Footer';

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <StatsSection />
                <HowItWorks />
            </main>
            <Footer />
        </>
    );
}
