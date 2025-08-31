import Log from '../models/Log.js';

/* global console */

export const logActivity = (action, resourceType) => {
  return async (req, res, next) => {
    // Salva a função original do res.json
    const originalJson = res.json;
    
    res.json = function(data) {
      // Chama a função original
      originalJson.call(this, data);
      
      // Depois faz o log
      createLog(req, res, action, resourceType, data);
    };
    
    next();
  };
};

const createLog = async (req, res, action, resourceType, responseData) => {
  try {
    const logData = {
      action,
      resourceType,
      userEmail: req.user?.email || 'Anonymous',
      userId: req.user?.id || null,
      details: {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      }
    };

    // Adiciona detalhes específicos baseado na ação
    switch (action) {
      case 'CREATE_POST':
      case 'UPDATE_POST':
        logData.resourceId = responseData._id || req.params.id;
        logData.details.title = responseData.title || req.body.title;
        logData.details.slug = responseData.slug || req.body.slug;
        logData.details.status = responseData.status || req.body.status;
        break;
      case 'DELETE_POST':
        logData.resourceId = req.params.id;
        break;
      case 'ERROR':
        logData.details.errorMessage = responseData.message || 'Unknown error';
        break;
    }

    await Log.create(logData);
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
};

export const logError = async (error, req, res, next) => {
  try {
    await Log.create({
      action: 'ERROR',
      resourceType: 'SYSTEM',
      userEmail: req.user?.email || 'Anonymous',
      userId: req.user?.id || null,
      details: {
        errorMessage: error.message,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      }
    });
  } catch (logError) {
    console.error('Erro ao salvar log de erro:', logError);
  }
  
  next(error);
};
