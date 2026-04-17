import Navbar from '../../components/visitor/NavBar/Navbar';
import HeroSection from '../../components/visitor/HeroSection/HeroSection';
import StatsSection from '../../components/visitor/StatsSection/StatsSection';
import HowItWorks from '../../components/visitor/HowItWorks/HowItWorks';
import Footer from '../../components/visitor/footer/Footer';

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
