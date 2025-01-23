import HeaderObra from '../components/headobra';
import VideoLineObra from '../components/videolineobra';
import Elencoobra from '../components/elencoobra';
import Imagenesobra from '../components/imagenesobra';
import Listapremiosobra from '../components/listapremiosobra';
import { Obracriticalista } from '../components/obracriticalista';

const Obra = () => {
    return(
        <>
        <HeaderObra />
        <VideoLineObra />
        <Elencoobra />
        <Imagenesobra imagen1="https://picsum.photos/400/300?random=1" imagen2="https://picsum.photos/400/300?random=2" imagen3="https://picsum.photos/400/300?random=3" imagen4="https://picsum.photos/400/300?random=4" imagen5="https://picsum.photos/400/300?random=5"/>
        <Listapremiosobra />
        <Obracriticalista />
        </>
)}

export default Obra;




