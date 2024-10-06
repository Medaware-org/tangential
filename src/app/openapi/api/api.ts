export * from './anterogradia.service';
import { AnterogradiaService } from './anterogradia.service';
export * from './status.service';
import { StatusService } from './status.service';
export * from './tangentialAuth.service';
import { TangentialAuthService } from './tangentialAuth.service';
export * from './tangentialContent.service';
import { TangentialContentService } from './tangentialContent.service';
export const APIS = [AnterogradiaService, StatusService, TangentialAuthService, TangentialContentService];
