USE [CESI_EATS]
GO

/****** Object:  Table [dbo].[users]    Script Date: 29/03/2025 21:20:46 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[users](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[address] [varchar](255) NOT NULL,
	[city] [varchar](255) NOT NULL,
	[country] [varchar](255) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[first_name] [varchar](50) NULL,
	[last_name] [varchar](100) NULL,
	[latitude] [float] NOT NULL,
	[longitude] [float] NOT NULL,
	[password] [varchar](255) NOT NULL,
	[phone_number] [varchar](255) NULL,
	[postal_code] [varchar](255) NOT NULL,
	[role] [varchar](255) NOT NULL,
	[created_at] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK6dotkott2kjsp8vw4d0m25fb7] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[users]  WITH CHECK ADD CHECK  (([role]='SERVICE_COMMERCIAL' OR [role]='DEVELOPER' OR [role]='ADMIN' OR [role]='LIVREUR' OR [role]='RESTAURATEUR' OR [role]='CLIENT'))
GO


