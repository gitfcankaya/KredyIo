using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KredyIo.API.Data;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
    optionsBuilder.UseSqlServer("Server=91.132.49.5\\SQLSERVER2022;Database=KrdyDB;User Id=dbman;Password=Db-2424!;TrustServerCertificate=True;MultipleActiveResultSets=true");
        
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}