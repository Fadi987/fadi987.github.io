// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-excited-to-announce-that-i-will-be-joining-the-machine-learning-department-at-carnegie-mellon-university-as-a-phd-student-starting-fall-2026",
          title: 'Excited to announce that I will be joining the Machine Learning Department at...',
          description: "",
          section: "News",},{id: "notes-continuous-normalizing-flows",
          title: 'Continuous Normalizing Flows',
          description: "Deriving the Lagrangian and Eulerian views of continuous normalizing flows and the adjoint method for efficient gradient computation.",
          section: "Notes",handler: () => {
              window.location.href = "/notes/continuous-normalizing-flows/";
            },},{id: "notes-eulerian-amp-lagrangian-views",
          title: 'Eulerian &amp;amp; Lagrangian Views',
          description: "A mathematical perspective on toggling between Eulerian and Lagrangian formulations in dynamical systems, and the conditions under which this is valid.",
          section: "Notes",handler: () => {
              window.location.href = "/notes/eulerian-lagrangian-views/";
            },},{id: "notes-stochastic-interpolants",
          title: 'Stochastic Interpolants',
          description: "Deriving the transport equation for stochastic interpolants using Fourier transforms, and why the Eulerian-Lagrangian toggle fails in this setting.",
          section: "Notes",handler: () => {
              window.location.href = "/notes/stochastic-interpolants/";
            },},{id: "teachings-introduction-to-statistical-data-analysis-6-401",
          title: 'Introduction to Statistical Data Analysis (6.401)',
          description: "Teaching assistant for MIT&#39;s Introduction to Statistical Data Analysis course with Professor Yury Polyanskiy. Designed a final project drawing from master&#39;s thesis, held office hours, and wrote problem sets. Received outstanding student ratings averaging 6.8 out of 7.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/statistical-data-analysis/";
            },},{id: "teachings-theory-of-computation-18-404",
          title: 'Theory of Computation (18.404)',
          description: "Teaching assistant for MIT&#39;s Theory of Computation course with Professor Michael Sipser. Taught recitations, co-piloted lectures, and held office hours. Received outstanding student ratings averaging 6.7 and 6.8 out of 7 in Fall 2020 and Fall 2021 respectively.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/theory-of-computation/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%66%61%64%69.%61%74%69%65%68%39%38@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Fadi987", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/fadi-atieh", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=teicZ5AAAAAJ", "_blank");
        },
      },{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/atieh_phd.pdf", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
