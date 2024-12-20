import React, { useState} from "react";
import { Box, Button, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import '@fontsource/open-sans';

const InitialPage = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRequestTour = () => {
    navigate('/request-tour');
  };

  const handleRequestFair = () => {
    navigate('/request-fair');
  };


  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      
      {/* Navbar */}
      <Container
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "16px",
          flexDirection: "row",
          gap: "20px",
          backgroundColor: "#003366",
        }}
      >
        <Button variant="outlined" 
        sx={{
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "white",
          },
        }}
        color="white" onClick={handleRequestTour}>
          Tur Talep Formu
        </Button>
        
        <Button variant="outlined" 
        sx={{
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "white",
          },
        }}
        color="white" onClick={handleRequestFair}>
          Fuar Talep Formu
        </Button>
      
        <Button variant="outlined" 
        sx={{
          color: "white",
          borderColor: "white",
          "&:hover": {
            borderColor: "white",
          },
        }}
        color="white" onClick={handleLogin}>
          GİRİŞ YAP
        </Button>
      </Container>


      {/* Content */}
      <Container
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
            backgroundColor: "#ffff",
            padding: "10px",
          }}
        >
        <Box  style={{ marginTop: "8" }} >
        <Box sx={{ width: 400, height: 100 }}>
      <img
        src="https://adaybilgi.bilkent.edu.tr/wp-content/uploads/2016/04/adaybilgi_logo.svg"
        alt="description"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Box>

 <Box
      sx={{
        display: 'flex', // Make the parent a flex container to align children side by side
        alignItems: 'center', // Vertically align the items in the center
        justifyContent: 'flex-start', // Align items to the left
        width: '100%', // Full width of the container
        marginTop: '20px', // Top margin
        marginBottom: '20px', // Bottom margin
      }}
    >

       {/* Box containing the text */}
       <Box
        sx={{
          padding: '20px',
          //border: '1px solid #ccc',
          //borderRadius: '8px',
          //backgroundColor: '#f9f9f9',
          width: '60%', // Adjust width of the text box
          marginRight: '50px', // Space between the text box and image
        }}
      >

          <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "left", // Left-align the text
            fontFamily: "'Open Sans', sans-serif", // Change the font
            color: 'black',
          }}
        >
        Bilkent'e Hoş Geldiniz!
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "left", // Left-align the text
            fontFamily: "'Open Sans', sans-serif", // Change the font
            color: 'black',
            marginTop: '20px', 
          }}
        >
        Bilkent Üniversitesi'nde Geleceğinizi Keşfedin
        </Typography>
        
     
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{
            textAlign: 'left', // Left-align the text
            fontFamily: "'Open Sans', sans-serif",
            color: 'black',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          Yenilikçi eğitim anlayışı, 
          güçlü akademik kadrosu ve uluslararası başarılarıyla Bilkent, 
          sizi geleceğe hazırlamak için burada. 1984’te kurulan üniversitemiz, 
          mühendislikten sanata, sosyal bilimlerden sağlığa kadar geniş bir 
          yelpazede sunduğu programlarla akademik ve kişisel gelişiminizi destekler. 
          Modern kampüsü ve kültürel çeşitliliğiyle, sizi hem Türkiye'de hem de 
          dünyada başarılı bir kariyere hazırlar.
        </Typography>
        
      </Box>

      {/* Box containing the image */}
      <Box
        sx={{
          width: '50%', // Adjust width of the image box
          height: '100%', // Maintain image aspect ratio
          marginRight: '50px',
        }}
      >
        <img
          src="https://adaybilgi.bilkent.edu.tr/wp-content/uploads/2018/06/slider5.jpg" 
          alt="Bilkent University"
          style={{
            width: '100%', // Make the image fit the box
            height: '100%', // Maintain the aspect ratio
            borderRadius: '8px', // Optional: rounded corners
          }}
        />
      </Box> 
      </Box>

      </Box>

        {/* Accordion Section - Why Choose Bilkent? */}
        <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h6" 
            sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Neden Bilkent'i Seçmelisiniz?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent Üniversitesi, akademik mükemmeliyet konusunda kendini 
              kanıtlamış bir üniversitedir. Uluslararası alanda tanınan birçok 
              akademisyenden oluşan güçlü kadromuz, en güncel bilgi ve deneyimleri 
              öğrencilerimize aktarmaktadır. Bilkent, bilim, mühendislik, beşeri 
              bilimler, sanat ve iş dünyası gibi geniş bir yelpazede sunduğu programlarla, 
              öğrencilerini hızla değişen dünyada başarılı olabilmeleri için gerekli bilgi ve donanımla yetiştirmektedir.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Accordion Section - State-of-the-Art Campus */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography variant="h6" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Kampüs
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
             Modern tesislerimizde ileri düzey laboratuvarlar, geniş kütüphaneler 
             ve dinamik kültürel alanlar bulunuyor. İster yenilikçi araştırmalar yapın, 
             ister yüksek teknolojiye sahip laboratuvarlarda çalışın, ister konser 
             salonlarımızda ve sanat galerilerimizde vakit geçirin, Bilkent kampüsü her zaman size ilham verecek bir ortam sunuyor.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Accordion Section - Global Opportunities */}
        <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography variant="h6" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Dünya Çapında Fırsatlar
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7"
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent’te eğitiminizin sınırı yok. Dünyanın önde gelen üniversiteleriyle 
              değişim programları sunuyoruz ve 100’ün üzerinde ülkeden gelen uluslararası 
              bir topluluğa sahibiz. Türkiye’nin zengin kültürünü ve tarihini keşfederken, 
              küresel bir akademik ağın parçası olma fırsatı bulacaksınız.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Accordion Section - Career-Ready Graduates */}
        <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
          >
            <Typography variant="h6"
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent Mezunları
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent, disiplinler arası öğrenmeye, yeniliğe ve liderliğe önem verir, 
              bu da mezunlarımızın iş dünyasında tercih edilmesini sağlar. Kariyer 
              Merkezi ise iş hayatına adım atarken size yol göstermek ve iş piyasasında 
              ilerlemenize yardımcı olmak için kişisel destek sunar.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Accordion Section - Vibrant Student Life */}
        <Accordion expanded={expanded === 'panel5'} onChange={handleAccordionChange('panel5')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5-content"
            id="panel5-header"
          >
            <Typography variant="h6" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Öğrenci Hayatı
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent’te hayat, hem eğlenceli hem de öğreticidir. 
              100’ün üzerinde öğrenci kulübü, spor takımları ve kültürel 
              etkinliklerle kampüste her zaman bir hareket vardır. Yeni 
              arkadaşlar edinir, farklı ilgi alanları keşfeder ve unutulmaz anılar biriktirirsiniz.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Accordion Section - Scholarships and Financial Aid */}
        <Accordion expanded={expanded === 'panel6'} onChange={handleAccordionChange('panel6')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6-content"
            id="panel6-header"
          >
            <Typography variant="h6" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Burslar
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h7" 
             sx={{
              fontFamily: "'Open Sans', sans-serif",
            }}
            gutterBottom>
              Bilkent Üniversitesi, yetenekli öğrencilere destek olmak için 
              birçok burs imkanı sunar. Akademik başarıyı ödüllendiren ve 
              maddi engelleri aşmaya yardımcı olan bu burslar, öğrencilerin 
              kaliteli bir eğitim almasını sağlar ve onları başarıya yönlendirir.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
   );
};

export default InitialPage;
