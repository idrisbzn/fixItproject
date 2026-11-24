import VisitorNavbar from '../../../components/visitor/NavBar/VisitorNavbar';
import HeroSection from '../../../components/visitor/HeroSection/HeroSection';
import StatsSection from '../../../components/visitor/StatsSection/StatsSection';
import HowItWorks from '../../../components/visitor/HowItWorks/HowItWorks';
import Footer from '../../../components/visitor/footer/Footer';

export default function LandingPage() {
    return (
        <>
            <VisitorNavbar />
            <main>
                <HeroSection />
                <StatsSection />
                <HowItWorks />
            </main>
            <Footer />
        </>
    );
}
