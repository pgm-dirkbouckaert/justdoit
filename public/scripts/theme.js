import dataService from "./dataService.js";

(() => {
  const app = {
    init() {
      this.themeLightLink = `<link rel="stylesheet" href="/css/theme-light.css">`;
      this.themeLightLinkQuery = `link[href="/css/theme-light.css"]`;
      // Cache elements
      this.cacheElements();
      // Theme
      // this.getThemeFromLocalStorage();
      this.listenForThemeToggler();
    },
    cacheElements() {
      this.$themeToggler = document.getElementById("theme-toggler");
    },
    /**
     * Theme
     */
    // getThemeFromLocalStorage() {
    //   const theme = localStorage.getItem("theme");
    //   if (!theme) localStorage.setItem("theme", "dark");
    //   else if (theme === "light") {
    //     this.$themeToggler.checked = true;
    //     this.setTheme(true);
    //   }
    // },
    listenForThemeToggler() {
      this.$themeToggler.addEventListener("change", (e) => {
        const checked = e.currentTarget.checked;
        this.setTheme(checked);
      });
    },
    /**
     * Utils
     */
    setTheme(light = false) {
      if (light) {
        // localStorage.setItem("theme", "light");
        dataService.saveTheme("light");
        document.head.innerHTML += this.themeLightLink;
      } else {
        // localStorage.setItem("theme", "dark");
        dataService.saveTheme("dark");
        document.querySelector(this.themeLightLinkQuery).remove();
      }
    },
  };
  app.init();
})();
