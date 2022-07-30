import { Controller, Get, Redirect } from '@nestjs/common'

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('default')
@Controller('')
export class AppController {
  @ApiOperation({ summary: `Redirects from the root path to the API documentation` })
  @ApiResponse({ status: 302, description: 'redirection url' })
  @Get('')
  @Redirect('api-docs', 302)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async apiDocsRedirect() {}
}
