﻿namespace MVCBoilerplate
{
    using Boilerplate.AspNetCore;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Infrastructure;
    using Microsoft.AspNetCore.Mvc.Routing;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Logging;

    // https://visualstudiogallery.msdn.microsoft.com/6cf50a48-fc1e-4eaf-9e82-0b2a6705ca7d

    /// <summary>
    /// The main start-up class for the application.
    /// </summary>
    public partial class Startup
    {
        #region Fields

        /// <summary>
        /// Gets or sets the application configuration, where key value pair settings are stored. See
        /// http://docs.asp.net/en/latest/fundamentals/configuration.html
        /// http://weblog.west-wind.com/posts/2015/Jun/03/Strongly-typed-AppSettings-Configuration-in-ASPNET-5
        /// </summary>
        private readonly IConfiguration configuration;

        /// <summary>
        /// The environment the application is running under. This can be Development, Staging or Production by default.
        /// To set the hosting environment on Windows:
        /// 1. On your server, right click 'Computer' or 'My Computer' and click on 'Properties'.
        /// 2. Go to 'Advanced System Settings'.
        /// 3. Click on 'Environment Variables' in the Advanced tab.
        /// 4. Add a new System Variable with the name 'ASPNETCORE_ENVIRONMENT' and value of Production, Staging or
        /// whatever you want. See http://docs.asp.net/en/latest/fundamentals/environments.html
        /// </summary>
        private readonly IHostingEnvironment hostingEnvironment;

        #endregion

        #region Constructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="hostingEnvironment">The environment the application is running under. This can be Development,
        /// Staging or Production by default.</param>
        public Startup(IHostingEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
            this.configuration = ConfigureConfiguration(hostingEnvironment);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Configures the services to add to the ASP.NET MVC 6 Injection of Control (IoC) container. This method gets
        /// called by the ASP.NET runtime. See:
        /// http://blogs.msdn.com/b/webdev/archive/2014/06/17/dependency-injection-in-asp-net-vnext.aspx
        /// </summary>
        /// <param name="services">The services collection or IoC container.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureAntiforgeryServices(services, this.hostingEnvironment);
            ConfigureCachingServices(services);
            ConfigureOptionsServices(services, this.configuration);

            // Configure MVC routing. We store the route options for use by ConfigureSearchEngineOptimizationFilters.
            RouteOptions routeOptions = null;
            IMvcBuilder mvcBuilder = services
                .AddRouting(
                    x =>
                    {
                        routeOptions = x;
                        ConfigureRouting(x);
                    })
                // Add useful interface for accessing the ActionContext outside a controller.
                .AddSingleton<IActionContextAccessor, ActionContextAccessor>()
                // Add useful interface for accessing the HttpContext outside a controller.
                .AddSingleton<IHttpContextAccessor, HttpContextAccessor>()
                // Add useful interface for accessing the IUrlHelper outside a controller.
                .AddScoped<IUrlHelper>(x => x
                    .GetRequiredService<IUrlHelperFactory>()
                    .GetUrlHelper(x.GetRequiredService<IActionContextAccessor>().ActionContext))
                // Add many MVC services to the services container.
                .AddMvc(
                    mvcOptions =>
                    {
                        ConfigureCacheProfiles(mvcOptions.CacheProfiles, this.configuration);
                        ConfigureSearchEngineOptimizationFilters(mvcOptions.Filters, routeOptions);
                        ConfigureSecurityFilters(this.hostingEnvironment, mvcOptions.Filters);
                        ConfigureContentSecurityPolicyFilters(this.hostingEnvironment, mvcOptions.Filters);
                    });

            ConfigureFormatters(mvcBuilder);
            ConfigureCustomServices(services);
        }

        /// <summary>
        /// Configures the application and HTTP request pipeline. Configure is called after ConfigureServices is
        /// called by the ASP.NET runtime.
        /// </summary>
        /// <param name="application">The application.</param>
        /// <param name="loggerfactory">The logger factory.</param>
        public void Configure(IApplicationBuilder application, ILoggerFactory loggerfactory)
        {
            // Removes the Server HTTP header from the HTTP response for marginally better security and performance.
            application.UseNoServerHttpHeader();


            // Add static files to the request pipeline e.g. hello.html or world.css.
            application.UseStaticFiles();

            ConfigureCookies(application, this.hostingEnvironment);
            ConfigureDebugging(application, this.hostingEnvironment);
            ConfigureLogging(this.hostingEnvironment, loggerfactory, this.configuration);
            ConfigureErrorPages(application, this.hostingEnvironment);
            ConfigureContentSecurityPolicy(application, this.hostingEnvironment);
            ConfigureSecurity(application, this.hostingEnvironment);

            // Add MVC to the request pipeline.
            application.UseMvc();
        }

        #endregion
    }
}